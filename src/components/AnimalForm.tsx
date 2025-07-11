import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { ComboBoxResponsive } from "@/components/ui/combo-box";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const animalSchema = z.object({
  tutor_id: z.string().min(1, "Selecione um tutor"),
  nome: z.string().min(1, "Nome é obrigatório"),
  especie: z.string().min(1, "Espécie é obrigatória"),
  raca: z.string().min(1, "Raça é obrigatória"),
  data_nascimento: z.string().min(1, "Data de nascimento é obrigatória"),
  sexo: z.string().min(1, "Sexo é obrigatório"),
  cor: z.string().min(1, "Cor é obrigatória"),
  peso: z.number().min(0.1, "Peso deve ser maior que 0"),
});

type AnimalFormData = z.infer<typeof animalSchema>;

interface Tutor {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
}

interface AnimalFormProps {
  tutores: Tutor[];
  onSave: (animal: AnimalFormData) => Promise<string>;
}

const AnimalForm = ({ tutores, onSave }: AnimalFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  

  const form = useForm<AnimalFormData>({
    resolver: zodResolver(animalSchema),
    defaultValues: {
      tutor_id: "",
      nome: "",
      especie: "",
      raca: "",
      data_nascimento: "",
      sexo: "",
      cor: "",
      peso: 0,
    },
  });

  const calcularIdade = (dataNascimento: string) => {
    if (!dataNascimento) return "";
    const hoje = new Date();
    // Adiciona o fuso horário local para evitar problemas de um dia a menos
    const nascimento = new Date(dataNascimento + "T00:00:00");
    let anos = hoje.getFullYear() - nascimento.getFullYear();
    let meses = hoje.getMonth() - nascimento.getMonth();
    let dias = hoje.getDate() - nascimento.getDate();

    // Ajustes para casos onde o mês/dia de aniversário ainda não passou no ano corrente
    if (meses < 0 || (meses === 0 && dias < 0)) {
      anos--;
      meses += 12;
    }

    if (anos > 0) {
      return `${anos} ${anos === 1 ? "ano" : "anos"}`;
    }
    if (meses > 0) {
      return `${meses} ${meses === 1 ? "mês" : "meses"}`;
    }
    // Para bebês, pode ser útil mostrar os dias
    const diffTime = Math.abs(hoje.getTime() - nascimento.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} ${diffDays === 1 ? "dia" : "dias"}`;
  };

  const normalizePhoneNumber = (phone: string) => {
    return phone.replace(/\D/g, "");
  };

  const onSubmit = async (data: AnimalFormData) => {
    setIsLoading(true);

    try {
      await onSave(data);
      form.reset();
      
      toast({
        title: "Sucesso!",
        description: "Animal cadastrado com sucesso.",
      });
    } catch (error) {
      console.error("Error saving animal:", error);
      toast({
        title: "Erro",
        description: "Erro ao salvar animal. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const especies = [
    "Cão",
    "Gato",
    "Coelho",
    "Hamster",
    "Pássaro",
    "Peixe",
    "Réptil",
    "Outro",
  ];

  const tutorOptions = tutores.map((tutor) => ({
    label: `${tutor.nome} - ${tutor.telefone}`,
    value: tutor.id,
  }));

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-crarar-primary">
          🐾 Dados do Animal
        </CardTitle>
        <CardDescription>Registre as informações do pet</CardDescription>
      </CardHeader>
      <CardContent>
        {tutores.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Você precisa cadastrar um tutor primeiro para registrar um animal.
            </p>
            <Button
              variant="outline"
              onClick={() =>
                toast({
                  title: "Dica",
                  description:
                    "Vá para a aba 'Tutor' e cadastre um responsável primeiro.",
                })
              }
            >
              Cadastrar Tutor Primeiro
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="tutor_id"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Tutor Responsável *</FormLabel>
                    <ComboBoxResponsive
                      options={tutorOptions}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Selecione o tutor"
                      searchPlaceholder="Buscar tutor por nome ou telefone..."
                      emptyPlaceholder="Nenhum tutor encontrado."
                      filter={(value, search) => {
                        const lowerCaseSearch = search.toLowerCase();
                        const isNumeric = /^\d+$/.test(search);

                        if (isNumeric) {
                          const tutorPhone = value.split(' - ')[1]?.replace(/\D/g, '') || ''
                          return tutorPhone.startsWith(search) ? 1 : 0;
                        } else {
                          const tutorName = value.split(' - ')[0].toLowerCase();
                          return tutorName.startsWith(lowerCaseSearch) ? 1 : 0;
                        }
                      }}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Animal *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Rex, Mimi..."
                          className="focus:border-crarar-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="especie"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Espécie *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="focus:border-crarar-primary">
                            <SelectValue placeholder="Selecione a espécie" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {especies.map((especie) => (
                            <SelectItem key={especie} value={especie}>
                              {especie}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="raca"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Raça *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Labrador, Persa..."
                          className="focus:border-crarar-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="data_nascimento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Nascimento *</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          className="focus:border-crarar-primary"
                          {...field}
                        />
                      </FormControl>
                      {field.value && (
                        <p className="text-sm text-crarar-primary">
                          Idade: {calcularIdade(field.value)}
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="sexo"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Sexo *</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex space-x-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Macho" id="macho" />
                          <Label htmlFor="macho">Macho</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Fêmea" id="femea" />
                          <Label htmlFor="femea">Fêmea</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cor *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Marrom, Branco..."
                          className="focus:border-crarar-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="peso"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Peso (kg) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="0.0"
                          className="focus:border-crarar-primary"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-crarar-primary hover:bg-crarar-primary/90 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? "Salvando..." : "Salvar Animal"}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};

export default AnimalForm;
